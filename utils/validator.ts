const Validator = () => {
  return {
    assets: (
      imageUrl: string,
      validateAssets: boolean,
      assets: string[],
      validateUrl: boolean = false
    ): Error | undefined => {
      try {
        const u = new URL(imageUrl);
        if (validateAssets && assets.indexOf(u.origin) < 0) {
          return new Error('Incorect assets');
        }
      } catch (err) {
        if (validateUrl) {
          return err;
        }
      }
      return undefined;
    }
  };
};

export default Validator;
