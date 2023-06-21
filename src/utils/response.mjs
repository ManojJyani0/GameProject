const clientResponse = async (res, status, success, data) => {
    return res.status(status).send({
      success,
      data,
    });
  };
  
  export default clientResponse;
  