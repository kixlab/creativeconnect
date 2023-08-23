import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Epic, ofType } from "redux-observable";
import { take, tap } from "rxjs";
import { StoreState } from "./store";

export const STARRED_IMAGE_LIST_PREFIX = "STARRED_IMAGE_LIST";

export type StarredImageListItem = {
  id: string;
  src: string;
};

export const starredImageListEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(starredImageListAction.addItem.type),
    take(1),
    tap((action$) => console.log(action$.payload))
  );

export const starredImageListEntity = createEntityAdapter<StarredImageListItem>();

export const starredImageListSlice = createSlice({
  name: STARRED_IMAGE_LIST_PREFIX,
  initialState: starredImageListEntity.setAll(starredImageListEntity.getInitialState(), []),
  reducers: {
    initialize(state, action) {
      starredImageListEntity.setAll(state, action.payload);
    },
    addItem(state, action) {
      if (Array.isArray(action.payload)) {
        starredImageListEntity.addMany(state, action.payload);
        return;
      }
      starredImageListEntity.addOne(state, action.payload);
    },
    removeItem(state, action) {
      if (Array.isArray(action.payload)) {
        starredImageListEntity.removeMany(state, action.payload);
        return;
      }
      starredImageListEntity.removeOne(state, action.payload);
    },
  },
});

const starredImageListReducer = starredImageListSlice.reducer;

export const starredImageListSelector = starredImageListEntity.getSelectors(
  (state: StoreState) => state.starredImageList
);
export const starredImageListAction = starredImageListSlice.actions;
export default starredImageListReducer;
