# run from ~/dev/purrio

cd /home/bryan/dev/purrio
echo "React production build..."
cd src/Deployer/clowder
npm run build
cd -
echo "Stackery Deploy..."
stackery deploy -e dev -n purrio --strategy local --aws-profile ampule
