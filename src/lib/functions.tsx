const validateEmail = (emailC: String) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    emailC.replace(/\s/g, ''),
  );
};

export {validateEmail};
