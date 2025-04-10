import { PayloadAction } from "@reduxjs/toolkit";

type WithLoadingAndError = {
  loading: boolean;
  error: string | null;
};

export const handlePending = <T extends WithLoadingAndError>(state: T) => {
  state.loading = true;
  state.error = null;
};

export const handleRejected = <T extends WithLoadingAndError>(
  state: T,
  action: PayloadAction<string>
) => {
  state.loading = false;
  state.error = action.payload;
};