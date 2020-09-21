<?php
require_once './TLSSigAPIv2.php';
$sdkAppId = 1400423298;
$SECRETKEY = 'ff3379f02e89e78180d727c65becf95f2e66fbd20e13d671df8c56a7ca358c3b';
$api = new \Tencent\TLSSigAPIv2( $sdkAppId, $SECRETKEY );
$sig = $api->genUserSig( $_REQUEST['userId'] );
$result = array('sdkAppId' => $sdkAppId,'userSig' => $sig);
echo json_encode($result);