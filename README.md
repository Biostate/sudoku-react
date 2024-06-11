# React Sudoku

This project is part of my graduation project.

![Friendship Feature](https://raw.githubusercontent.com/Biostate/sudoku-react/master/art/friend_request.gif)

## TODO

- [x] Update friend system
- [x] Add timer
- [x] Add coop player highlight
- [x] Add more configurations
- [x] Add more themes

## Installation
```
npm i
composer i
npm run build
```
## Running the app

```
php artisan reverb:start
php artisan serve
```

## Fix Reverb SSL Problems

To fix the SSL problems you can add your SSL certificate to the .env file. For example:

```
REVERB_TLS_CERT="C:/laragon/etc/ssl/laragon.crt"
REVERB_TLS_PK="C:/laragon/etc/ssl/laragon.key"
```

Also if this doesn't work you can disable the SSL verification by adding this to the .env file:

```
REVERB_TLS_VERIFY=false
```
