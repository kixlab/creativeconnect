import { useDispatch, useSelector } from "react-redux";
import {
  SelectedLabelListItem,
  selectedLabelListAction,
  selectedLabelListSelector,
} from "../redux/selectedLabelList";

const useLabelSelection = () => {
  const dispatch = useDispatch();
  const selectedLabelList = useSelector(selectedLabelListSelector.selectAll);

  const addSelectedLabel = async (label: SelectedLabelListItem) => {
    dispatch(
      selectedLabelListAction.addItem({
        id: label.id,
        type: label.type,
        fileid: label.fileid,
        keyword: label.keyword,
      })
    );
  };

  const removeSelectedLabel = async (id: SelectedLabelListItem["id"]) => {
    dispatch(selectedLabelListAction.removeItem(id));
  };

  const getAllSelectedLabel = (): SelectedLabelListItem[] => {
    return selectedLabelList;
  };

  return {
    addSelectedLabel,
    removeSelectedLabel,
    getAllSelectedLabel,
  };
};

export default useLabelSelection;
