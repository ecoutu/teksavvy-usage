teksavvy
========

![](/teksavvy-usage.png?raw=true)

Pretty usage charts for Teksavvy Internet. 

# Setup

```
npm install
bower install
```

# Run

Checks two environment variables:

* `ADDRESS`: bind address, default is `0.0.0.0`
* `PORT`: bind port, default is `8080`

```
node app/index.js
```

Visit `localhost:8080` and enter your Teksavvy API key.

If you want to save a bookmark, you can use the `api-key=xxx` query parameter in the webapp, eg: http://localhost:8080/?api-key=xxx
