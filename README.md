# themis-web-interface
[![Build Status](https://travis-ci.org/natsukagami/themis-web-interface.svg?branch=master)](https://travis-ci.org/natsukagami/themis-web-interface)

A web interface for Themis, written in Node.js

- [Running(Cách chạy)](#running)
	- [From prebuilt archive(Tải từ release)](#from-prebuilt-archive)
	- [From source(Nâng cao)](#from-source)
- [Configuration](#configuration)
- [Building](#building)
- [Contributing](#contributing)
	- [LF / CRLF Problem](#lf--crlf-problem)
	- [`public/js/index.js` file](#publicjsindexjs-file)
- [Current Implementation Status](#current-implementation-status)

## Running
### From prebuilt archive
The most straightforward way to run is to download a prebuilt version of the project [here](https://github.com/Ming2k8-Coder/themis-web-interface). This includes all production required modules, as well as a bundled Node.js executable (Windows)  and a batch script file to quickly start the server (Windows only).
After downloading, extract the archive, do the [configuration](#configuration) and execute `run.bat`. The script will setup proper environment variables and launch the server.

### Tải từ release
Đây là cách chính thống để chạy ứng dụng này, các phiên bản có thể tìm [ở đây](https://github.com/Ming2k8-Coder/themis-web-interface/releases). Bản này đã được bao gồm đầy đủ thư viện nên tải về chỉ cần chạy run.bat cho windows.  
Đối với linux thì cần cài đặt npm để chạy (Nó cũng đảm bảo bạn chạy node.js mới nhất).  
Bạn có thể gg cách tạo service cho windows và linux để tự bật khi khởi động máy (server mode).

### From source
The source code also provides a prebuilt production-ready version of Browserify `index.js`.

In addition to the source code, you should have the following apps/scripts installed:
- [Node.js](http://nodejs.org) version >= 6 alongside npm
- [cross-env](https://www.npmjs.org/package/cross-env) `npm install -g cross-env`

After cloning the source code open a terminal and type:
```
npm install --production
```

When the module installation finishes you can start the server anytime with:
```
npm start
```
When deploy server 
```
npm run prod
```

## Configuration
The most basic configurations are available in `config.js`, which includes:
- Contest name
- Toggle scoreboard function
- Contest mode, which includes:
 + Timing for submit
 + Contest clock
 + Hiding results before contest ends

Accounts are automatically parsed from `data\account.xml` (I know, WTF, but it keeps backwards-compability with the old web server. Furthermore, it supports editing from Excel.)

Themis' online submitting directory should be changed to `data\submit`. There's currently no way to change that (there will be in the future).

Any public files should be put into `data\files` directory. It will automatically be cached into the server to avoid LFI attacks.

## Building
For best compatibility with my own build scripts I recommend using [yarn](https://yarnpkg.com) over npm. Currently the build scripts should work fine with npm however this is not promised in the future.

First run `yarn` (`npm install` with npm) to install all build modules. This could take some time, as there are lots of modules required.

Open a terminal within the source code's root folder and type `yarn build` (`npm build` with npm) to build the `.zip` package. It will be available in the `dist` folder.

Alternatively `yarn build-jsx` (`npm run build-jsx`) can be used to only build the JSX files with Browserify.

## Contributing
Please follow the ESLint restrictions included with the source code. I am glad to look at any problem you face and will kindly respond to all legitimate PRs so do not hesitate. Feature requests are also welcomed, however if you only come up with the idea and no details or any intent to code / help me out with its implementation, please go away.

### LF / CRLF Problem (git attribute fix soon)
All code files ends a line with `LF`. Only real data files (e.g. log files in `tests/`) can be allowed to end with CRLF. I will disaprove any PR using CRLF.

### `public/js/index.js` file
If any changes are made to `.jsx` files, a `yarn build-jsx` must be ran (on Linux, recommended) to recompile the `public/js/index.js` file. This is required to help anyone who wish to run the project from source without rebuilding everything. If neccessary I will further push an official `build-jsx` build if the build environment is different.

## Current Implementation Status
 - [x] Basic functions (submitting, judge result receiving).
 - [x] Account parsing.
 - [x] Account registration.
 - [x] Account modification.
 - [x] Offline submission saving with `localStorage`.
 - [ ] Online submission saving.
 - [x] Judge result parsing.
 - [x] Public file serving.
 - [x] Web code editor.
 - [x] More lightweight JS file (now gzipped to under 512kB!).
 - [x] Auto update.
 - [x] Scoreboard.
