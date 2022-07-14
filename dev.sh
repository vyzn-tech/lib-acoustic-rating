#!/usr/bin/env bash
set -e

function configure_git() {
  git config core.hooksPath .devops/githooks
}

function init() {
  update
}

availableArguments="init update help"
trap "exit" INT

function update() {
  configure_git
  [ -d node_modules ] || mkdir node_modules
  rm -Rf node_modules/*
  npm install
  chmod +x node_modules/.bin/*
}

function init() {
    git submodule update --init
    update
}

function help() {
    echo ""
    echo "Usage: $0 [argument]"
    echo ""
    echo "Available arguments:"
    echo "init            init the project and all submodules"
    echo "update          updates all dependencies"
    echo "help            display this"
}

if [[ "$1" == "" ]]; then
    echo "$0 requires at least 1 argument!"
    help
    exit 1
fi

if [[ "$availableArguments" != *"$1"* ]]; then
    echo "Error: unknown argument $1"
    exit 1
fi

"$1" "$2"
