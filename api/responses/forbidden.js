module.exports = function forbidden(message) {

    const req = this.req;
    const res = this.res;
  
    const viewFilePath = '403';
    const statusCode = 403;
  
    let result = {
      status: statusCode
    };
  
    // Optional message
    if (message) {
      result.message = message;
    }
  
    // If the user-agent wants a JSON response, send json
    if (req.wantsJSON) {
      return res.status(result.status).json({ message:'403 - ACCESS DENIED' });
    }
  
    // Set status code and view locals
    res.status(result.status);
    for (var key in result) {
      res.locals[key] = result[key];
    }

    // And render view
    res.render(viewFilePath, result, function(err) {
      // If the view doesn't exist, or an error occured, send json
      if (err) {
        return res.status(result.status).json({message:'Error !'});
      }
      
      res.render(viewFilePath);
    });
  
  };
  