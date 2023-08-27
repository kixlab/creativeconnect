import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { nanoid } from "nanoid";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import { keywordTypes } from "../../config/keywordTypes";
import { sendImage, imageToKeywords } from "../../api/ImageElementAPI";
import { CustomSelectButton } from "../util/elements";

import "./ImageWidget.css";
import useItem from "../../hook/useItem";

type UploadedImage = {
  id: string;
  keywords: any[];
  filename: string;
  src: string;
};

interface ImageWidgetProp {
  selectedItems: any[];
}

const urlParams = new URLSearchParams(window.location.search);
const CONDITION = urlParams.get("c") === "C" ? "CONTROL" : "TREATMENT";

const ImageWidget: React.FC<ImageWidgetProp> = ({ selectedItems }) => {
  const [isLoading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  const [displayImage, setDisplayImage] = useState<any>(null);

  useEffect(() => {
    setUploadedImage(null);
    if (selectedItems.length === 0 || selectedItems.length > 1) {
      setDisplayImage(null);
      return;
    }
    setDisplayImage(selectedItems[0]);
  }, [selectedItems]);

  const uploadImage = () => {
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      setLoading(true);
      const fileContent = e.target?.result;
      if (CONDITION === "CONTROL") {
        sendImage({ image: fileContent })
          .then((res: any) => {
            setUploadedImage({
              id: nanoid(),
              src: fileReader.result as string,
              keywords: [],
              filename: res.data.filename,
            });
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        imageToKeywords({ image: fileContent })
          .then((res: any) => {
            setUploadedImage({
              id: nanoid(),
              src: fileReader.result as string,
              keywords: [...res.data.keywords, { keyword: "", type: "Arrangement" }],
              filename: res.data.filename,
            });
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    };
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/png, image/jpeg";
    file.onchange = (e) => {
      const event = e;
      if (event.target && (event.target as HTMLInputElement).files) {
        Object.values((event.target as HTMLInputElement).files!).forEach((file) => {
          fileReader.readAsDataURL(file);
        });
      }
    };
    file.click();
  };

  return (
    <Col className="imageWidgetWrapper" style={{ flex: 1 }}>
      <button
        className="btn btn-custom w-100 mb-3"
        onClick={!isLoading ? uploadImage : () => {}}
        disabled={isLoading}
      >
        {!isLoading ? (
          <span>Upload new image</span>
        ) : (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            <span role="status">Analyzing your image...</span>
          </>
        )}
      </button>

      <Row xs={1}>
        {displayImage && (
          <CurrImageThumbnail key={`image-thumbnail-${displayImage.id}`} item={displayImage} />
        )}
        {uploadedImage && (
          <NewImageThumbnail key={`image-thumbnail-${uploadedImage.id}`} data={uploadedImage} />
        )}
      </Row>
    </Col>
  );
};

export default ImageWidget;

const CurrImageThumbnail: React.FC<{
  item: any;
}> = ({ item }) => {
  const { updateKeywords } = useItem();

  const [allKeywords, setAllKeywords] = useState<any[]>(item.attrs.allKeywords);
  const [selectedKeywords, setSelectedKeywords] = useState<any[]>(item.attrs.keywords);
  const [showKeywords, setShowKeywords] = useState(
    keywordTypes.reduce((acc, cur) => {
      acc[cur] = item.attrs.keywords.filter((keyword: any) => keyword.type === cur).length > 0;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  useEffect(() => {
    setAllKeywords(item.attrs.allKeywords);
    setSelectedKeywords(item.attrs.keywords);
    setShowKeywords(
      keywordTypes.reduce((acc, cur) => {
        acc[cur] = item.attrs.keywords.filter((keyword: any) => keyword.type === cur).length > 0;
        return acc;
      }, {} as { [key: string]: boolean })
    );
  }, [item]);

  useEffect(() => {
    updateKeywords(item.id(), selectedKeywords, allKeywords);
  }, [selectedKeywords, allKeywords]);

  const handleCustomInputSubmit = (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    const keyword = (e.target as any).keywordName.value;
    if (type && keyword) {
      setAllKeywords((prev) => [...prev, { keyword, type }]);
    }
    (e.target as any).keywordName.value = "";
  };

  return (
    <div>
      <div className="position-relative mb-3">
        <img
          alt={item.id}
          style={{ maxHeight: "300px", objectFit: "contain" }}
          className="w-100"
          src={item.image().src}
        />
      </div>
      <hr />
      <h5 className="mb-1">Why do you like this reference?</h5>
      <p className="mb-4 subtitle">
        Choose the keywords that you like about this reference. Then, drag the image to the canvas.
      </p>
      {CONDITION === "CONTROL" ? (
        <>
          <form
            style={{ display: "inline-block", width: "100%" }}
            onSubmit={(e) => handleCustomInputSubmit(e, "Note")}
          >
            <div className="input-group input-group-sm mb-3 w-100">
              <input
                id="keywordName"
                type="text"
                className="form-control"
                style={{ borderColor: "gray" }}
              />
              <button className="btn btn-outline-secondary" type="submit">
                +
              </button>
            </div>
          </form>
          {allKeywords
            .filter((keyword) => keyword.type === "Note")
            .map((keyword) => (
              <CustomSelectButton
                id={item.id + "-" + keyword.type + "-" + keyword.keyword}
                name={keyword.keyword}
                type={keyword.type}
                selected={
                  selectedKeywords.filter(
                    (selectedKeyword) =>
                      selectedKeyword.type === keyword.type &&
                      selectedKeyword.keyword === keyword.keyword
                  ).length > 0
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedKeywords((prev) => [...prev, keyword]);
                  } else
                    setSelectedKeywords((prev) => {
                      return prev.filter(
                        (prevKeyword) =>
                          prevKeyword.type !== keyword.type ||
                          prevKeyword.keyword !== keyword.keyword
                      );
                    });
                }}
              />
            ))}
        </>
      ) : (
        <>
          {keywordTypes
            .filter((type) => type !== "Arrangement")
            .map((type) => (
              <>
                <div>
                  <CustomSelectButton
                    id={"category-" + type}
                    name={`I like the ${type} of this reference`}
                    type={type}
                    selected={showKeywords[type]}
                    onChange={(e) => {
                      setShowKeywords((prev) => ({ ...prev, [type]: e.target.checked }));
                    }}
                  />
                </div>
                <div className="ms-3">
                  {showKeywords[type] &&
                    allKeywords
                      .filter((keyword) => keyword.type === type)
                      .map((keyword) => (
                        <CustomSelectButton
                          id={item.id + "-" + keyword.type + "-" + keyword.keyword}
                          name={keyword.keyword}
                          type={keyword.type}
                          selected={
                            selectedKeywords.filter(
                              (selectedKeyword) =>
                                selectedKeyword.type === keyword.type &&
                                selectedKeyword.keyword === keyword.keyword
                            ).length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedKeywords((prev) => [...prev, keyword]);
                            } else
                              setSelectedKeywords((prev) => {
                                return prev.filter(
                                  (prevKeyword) =>
                                    prevKeyword.type !== keyword.type ||
                                    prevKeyword.keyword !== keyword.keyword
                                );
                              });
                          }}
                        />
                      ))}
                  {showKeywords[type] && (
                    <form
                      style={{ display: "inline-block", width: "120px" }}
                      onSubmit={(e) => handleCustomInputSubmit(e, type)}
                    >
                      <div className="input-group input-group-sm mb-3">
                        <input
                          id="keywordName"
                          type="text"
                          className="form-control"
                          style={{ borderColor: "gray" }}
                        />
                        <button className="btn btn-outline-secondary" type="submit">
                          +
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            ))}
          <div>
            <CustomSelectButton
              id={"category-Arrangement"}
              name={`I like the Arrangement of this reference`}
              type={"Arrangement"}
              selected={
                selectedKeywords.filter(
                  (keyword) => keyword.type === "Arrangement" && keyword.keyword === ""
                ).length > 0
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedKeywords((prev) => [...prev, { keyword: "", type: "Arrangement" }]);
                } else
                  setSelectedKeywords((prev) =>
                    prev.filter((prevKeyword) => prevKeyword.type !== "Arrangement")
                  );
              }}
            />
          </div>
        </>
      )}
      <div className="d-flex flex-wrap mb-3"></div>
    </div>
  );
};

const NewImageThumbnail: React.FC<{
  data: Omit<UploadedImage, "image">;
}> = ({ data: { id, filename, ...data } }) => {
  const [allKeywords, setAllKeywords] = useState<any[]>(data.keywords);
  const [selectedKeywords, setSelectedKeywords] = useState<any[]>([]);
  const [showKeywords, setShowKeywords] = useState(
    keywordTypes.reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const handleCustomInputSubmit = (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    const keyword = (e.target as any).keywordName.value;
    if (type && keyword) {
      setAllKeywords((prev) => [...prev, { keyword, type }]);
    }
    (e.target as any).keywordName.value = "";
  };

  return (
    <div>
      <Drag
        dragType="copyMove"
        dragSrc={{
          trigger: TRIGGER.INSERT.IMAGE,
          "data-item-type": "image",
          src: data.src.startsWith("data:")
            ? data.src
            : `${process.env.PUBLIC_URL}/assets/image/${data.src}`,
          allKeywords: allKeywords,
          keywords: selectedKeywords,
          filename: filename,
        }}
      >
        <div className="position-relative mb-3">
          <img
            alt={id}
            style={{ maxHeight: "300px", objectFit: "contain" }}
            className="w-100"
            src={
              data.src.startsWith("data:")
                ? data.src
                : `${process.env.PUBLIC_URL}/assets/image/${data.src}`
            }
          />
        </div>
      </Drag>
      <hr />
      <h5 className="mb-1">Why do you like this reference?</h5>
      <p className="mb-4 subtitle">
        Choose the keywords that you like about this reference. Then, drag the image to the canvas.
      </p>
      {CONDITION === "CONTROL" ? (
        <>
          <form
            style={{ display: "inline-block", width: "100%" }}
            onSubmit={(e) => handleCustomInputSubmit(e, "Note")}
          >
            <div className="input-group input-group-sm mb-3 w-100">
              <input
                id="keywordName"
                type="text"
                className="form-control"
                style={{ borderColor: "gray" }}
              />
              <button className="btn btn-outline-secondary" type="submit">
                +
              </button>
            </div>
          </form>
          {allKeywords.map((keyword) => (
            <CustomSelectButton
              id={filename + "-" + keyword.type + "-" + keyword.keyword}
              name={keyword.keyword}
              type={keyword.type}
              selected={
                selectedKeywords.filter(
                  (selectedKeyword) =>
                    selectedKeyword.type === keyword.type &&
                    selectedKeyword.keyword === keyword.keyword
                ).length > 0
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedKeywords((prev) => [...prev, keyword]);
                } else
                  setSelectedKeywords((prev) =>
                    prev.filter((prevKeyword) => prevKeyword !== keyword)
                  );
              }}
            />
          ))}
        </>
      ) : (
        <>
          {keywordTypes
            .filter((type) => type !== "Arrangement")
            .map((type) => (
              <>
                <div>
                  <CustomSelectButton
                    id={"category-" + type}
                    name={`I like the ${type} of this reference`}
                    type={type}
                    selected={showKeywords[type]}
                    onChange={(e) => {
                      setShowKeywords((prev) => ({ ...prev, [type]: e.target.checked }));
                    }}
                  />
                </div>
                <div className="ms-3">
                  {showKeywords[type] &&
                    allKeywords
                      .filter((keyword) => keyword.type === type)
                      .map((keyword) => (
                        <CustomSelectButton
                          id={filename + "-" + keyword.type + "-" + keyword.keyword}
                          name={keyword.keyword}
                          type={keyword.type}
                          selected={
                            selectedKeywords.filter(
                              (selectedKeyword) =>
                                selectedKeyword.type === keyword.type &&
                                selectedKeyword.keyword === keyword.keyword
                            ).length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedKeywords((prev) => [...prev, keyword]);
                            } else
                              setSelectedKeywords((prev) =>
                                prev.filter((prevKeyword) => prevKeyword !== keyword)
                              );
                          }}
                        />
                      ))}
                  {showKeywords[type] && (
                    <form
                      style={{ display: "inline-block", width: "120px" }}
                      onSubmit={(e) => handleCustomInputSubmit(e, type)}
                    >
                      <div className="input-group input-group-sm mb-3">
                        <input
                          id="keywordName"
                          type="text"
                          className="form-control"
                          style={{ borderColor: "gray" }}
                        />
                        <button className="btn btn-outline-secondary" type="submit">
                          +
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            ))}
          <div>
            <CustomSelectButton
              id={"category-Arrangement"}
              name={`I like the Arrangement of this reference`}
              type={"Arrangement"}
              selected={
                selectedKeywords.filter(
                  (keyword) => keyword.type === "Arrangement" && keyword.keyword === ""
                ).length > 0
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedKeywords((prev) => [...prev, { keyword: "", type: "Arrangement" }]);
                } else
                  setSelectedKeywords((prev) =>
                    prev.filter((prevKeyword) => prevKeyword.type !== "Arrangement")
                  );
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
