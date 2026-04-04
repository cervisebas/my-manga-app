export interface TranslationResult {
  text: string;
  from: {
    language: {
      iso: string;
      didYouMean?: string;
    };
    text: {
      value: string;
      autoCorrected?: boolean;
      didYouMean?: boolean;
    };
  };
}
