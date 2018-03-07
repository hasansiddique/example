#!/bin/bash

OS=$(uname -s)
clear

# Setup sys link for foundation
cd client/app/css/ ;
ln -s ../../../node_modules/zurb-foundation-5/scss zurb

echo "-----------------------------------------------------------------------"
echo "Setup complete."
echo "You can now run 'gulp or npm start' to build & launch the project"
echo "-----------------------------------------------------------------------"
echo ""