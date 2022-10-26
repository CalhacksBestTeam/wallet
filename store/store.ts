import {configureStore} from '@reduxjs/toolkit'
import {store} from "next/dist/build/output/store";
import {connectedSlice} from "./features/connectedSlice";
// ...

export default configureStore({
    reducer: {
        connected: connectedSlice.reducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
