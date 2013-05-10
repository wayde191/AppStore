#!/usr/bin/env bash

cd $(dirname $0)
	
# Get the jar to use.
jar="$(ls ./*.jar | sort | tail -n1)"
echo "jar: $jar"

(cat ../iHakula/js/ThirdPartFrameworks/jquery-1.9.1.min.js ../iHakula/js/ThirdPartFrameworks/jquery-ui-1.10.2.custom.min.js ../iHakula/js/ThirdPartFrameworks/jquery.handsontable.full.js ../iHakula/js/ThirdPartFrameworks/jquery-plugin-animation.js ../iHakula/js/ThirdPartFrameworks/jquery-plugin-data.js ../iHakula/js/ThirdPartFrameworks/main.js ../iHakula/js/ThirdPartFrameworks/modernizr.js ../iHakula/js/ThirdPartFrameworks/signal.js ../iHakula/js/ThirdPartFrameworks/cover.js ../iHakula/js/ThirdPartFrameworks/coverflow.js ../iHakula/js/ThirdPartFrameworks/utils.js ../iHakula/js/ThirdPartFrameworks/playlistloader.js ../iHakula/js/ThirdPartFrameworks/controller.js ../iHakula/js/ThirdPartFrameworks/flash.js ../iHakula/js/ThirdPartFrameworks/html5.js ../iHakula/js/ThirdPartFrameworks/spin.js ../iHakula/js/ThirdPartFrameworks/jquery.handsontable.removeRow.js  > ./src/tools.js)

(cat ../iHakula/js/iHFramework/IHObject.js ../iHakula/js/iHFramework/IHUtils.js ../iHakula/js/iHFramework/IHPackage.js ../iHakula/js/iHFramework/IHXML.js ../iHakula/js/iHFramework/IHScroll.js ../iHakula/js/iHFramework/IHPubSub.js ../iHakula/js/iHFramework/IHMessage.js ../iHakula/js/iHFramework/IHKeyMap.js ../iHakula/js/iHFramework/IHUser.js ../iHakula/js/iHFramework/IHService.js ../iHakula/js/iHFramework/IHGantt.js ../iHakula/js/iHFramework/IHAMPPlugin.js ../iHakula/js/iHFramework/IHAMPEngine.js > ./src/ihakula.js)

(cat ../iHakula/css/style.css ../iHakula/css/objc.css ../iHakula/css/coverflow.css ../iHakula/css/button.css ../iHakula/css/animate.css ../iHakula/css/gantt.css ../iHakula/css/jquery.handsontable.full.css ../iHakula/css/jquery.handsontable.removeRow.css > ./src/main.css)

exit 0
