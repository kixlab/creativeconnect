import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Epic, ofType } from "redux-observable";
import { take, tap } from "rxjs";
import { StoreState } from "./store";

export const SELECTED_LABEL_LIST_PREFIX = "SELECTED_LABEL_LIST";

export type SelectedLabelListItem = {
  id: string;
  type: string;
  fileid: string;
  keyword: string;
};

export const selectedLabelListEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(selectedLabelListAction.addItem.type),
    take(1),
    tap((action$) => console.log(action$.payload))
  );

export const selectedLabelListEntity = createEntityAdapter<SelectedLabelListItem>();

export const selectedLabelListSlice = createSlice({
  name: SELECTED_LABEL_LIST_PREFIX,
  initialState: selectedLabelListEntity.setAll(selectedLabelListEntity.getInitialState(), []),
  reducers: {
    initialize(state, action) {
      selectedLabelListEntity.setAll(state, action.payload);
    },
    addItem(state, action) {
      selectedLabelListEntity.addOne(state, action.payload);
    },
    removeItem(state, action) {
      selectedLabelListEntity.removeOne(state, action.payload);
    },
  },
});

const selectedLabelListReducer = selectedLabelListSlice.reducer;

export const selectedLabelListSelector = selectedLabelListEntity.getSelectors(
  (state: StoreState) => state.selectedLabelList
);
export const selectedLabelListAction = selectedLabelListSlice.actions;
export default selectedLabelListReducer;
