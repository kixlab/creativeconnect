import { useDispatch, useSelector } from "react-redux";
import {
  StarredImageListItem,
  starredImageListAction,
  starredImageListSelector,
} from "../redux/starredImageList";

const useStarredImageList = () => {
  const dispatch = useDispatch();
  const starredImageList = useSelector(starredImageListSelector.selectAll);

  const addStarredImage = async (newImg: StarredImageListItem) => {
    dispatch(
      starredImageListAction.addItem({
        id: newImg.id,
        src: newImg.src,
      })
    );
  };

  const removeStarredImage = async (id: StarredImageListItem["id"]) => {
    dispatch(starredImageListAction.removeItem(id));
  };

  const findStarredImage = (id: StarredImageListItem["id"]) => {
    return starredImageList.find((item) => item.id === id);
  };

  const getAllStarredImage = (): StarredImageListItem[] => {
    return starredImageList;
  };

  return {
    addStarredImage,
    removeStarredImage,
    findStarredImage,
    getAllStarredImage,
  };
};

export default useStarredImageList;
