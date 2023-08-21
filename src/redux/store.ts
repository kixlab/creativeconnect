import {
  combineReducers,
  configureStore,
  EntityState,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";

import { persistReducer } from "redux-persist";
import { createLogger } from "redux-logger";
import storage from "redux-persist/lib/storage";

import stageDataReducer, { StageData, stageDataEpic } from "./currentStageData";
import selectedLabelListReducer, { SelectedLabelListItem } from "./selectedLabelList";
import starredImageListReducer, { StarredImageListItem } from "./starredImageList";
import persistStore from "redux-persist/es/persistStore";

export type StoreState = {
  currentStageData: EntityState<StageData["attrs"]>;
  selectedLabelList: EntityState<SelectedLabelListItem>;
  starredImageList: EntityState<StarredImageListItem>;
};

const epicMiddleware = createEpicMiddleware();
const rootEpic = combineEpics(stageDataEpic);

const rootReducer = combineReducers({
  currentStageData: stageDataReducer,
  selectedLabelList: selectedLabelListReducer,
  starredImageList: starredImageListReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["selectedLabelList"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureKonvaEditorStore = (preloadedState?: StoreState) => {
  const loggerMiddleware = createLogger();
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({ serializableCheck: false }).concat(
      epicMiddleware,
      loggerMiddleware
    ),
    preloadedState,
  });
  epicMiddleware.run(rootEpic);
  const persistor = persistStore(store);

  return { store, persistor };
};

export default configureKonvaEditorStore;
