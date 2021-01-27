0. initialize package.json
```
npm init
```

1. Install babel (https://babeljs.io/setup#installation)
```npm install --save-dev @babel/core @babel/cli```
Add start up script in *package.json*.
```
{
    "name": "my-project",
    "version": "1.0.0",
+   "scripts": {
+     "build": "babel src -d lib"
+   },
    "devDependencies": {
      "@babel/cli": "^7.0.0"
    }
  }
```
run the following command:
```
npm run build
```

2. Configure babel
- Create *"babel.config.json"* in the project root and enable some presets.
- Use env preset for ES2015+
```
npm install @babel/preset-env --save-dev
```
Enable the preset by editing *"babel.config.json"*:
```
{
  "presets": ["@babel/preset-env"]
}
```

