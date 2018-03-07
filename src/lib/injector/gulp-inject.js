/*
## Inject

*New @ 1.4.0* This is an end user request, to add the injection. The configuration option as follow:

```js
  const gulpServerIo = require('gulp-server-io');
  const config = {
    inject: {
      source: ['../src/js/*.js', '../src/css/*.css'],
      target: ['index.html', 'other.html', '404.html']
    }
  }
  gulp('src').pipe(
    gulpServerIo(config)
  );
```

Internally, I am using [gulp-inject](https://www.npmjs.com/package/gulp-inject), you need to follow how they prepare the html file for injection.

```html
<!DOCTYPE html>
<html>
<head>
  <title>My index</title>
  <!-- inject:css -->
  <!-- endinject -->
</head>
<body>

  <!-- inject:js -->
  <!-- endinject -->
</body>
</html>
```

It's only using part of the injection feature, more options will be add in the future.

  this is still problematic, exactly when this should happen?
  Because the gulp-server-io is the final call after all the files been transform
  if we stick the inject there before? after or in between.
  
*/
