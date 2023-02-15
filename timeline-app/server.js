const corsAnywhere = require('cors-anywhere');

const port = process.env.PORT || 8080;

// Configure CORS Anywhere
const cors = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: [],
  removeHeaders: []
});

// Listen on the specified port
cors.listen(port, () => {
  console.log(`CORS Anywhere server is running on port ${port}`);
});