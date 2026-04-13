import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

let zegoInstance = null;
let userHasJoined = false;
let isDestroying = false;

const zegoAppId = import.meta.env.VITE_ZEGO_APP_ID
const zegoServerSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET

export const generateKitToken = (roomId, userId, userName) => {
    console.log(roomId, userId, userName);

    if (!zegoAppId) {
        throw new Error('gegocloud app id is not configured. Please set the value in the env')
    }

    const appId = parseInt(zegoAppId)
    if (isNaN(appId)) {
        throw new Error("Invalid Zegocloud ap id. Must be in number")
    }
    try {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appId,
            zegoServerSecret || "",
            roomId,
            userId.toString(),
            userName || `User_${userId}`

        )

        if (!kitToken) {
            throw new Error('Token generation returned empty token')
        }

        return kitToken
    } catch (error) {
        console.log('Token Generation Error', error);
        throw new Error(`Failed to generate zego token: ${error.message}`);
    }
}


// Request browser Permission for camera & microphone

const requestMediaPermission = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })

        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.log("Failed to get media permission", error);
        return false;

    }
}


export const joinRoom = async (roomId, userId, userName, container, onJoinCallback, onLeaveCallback) => {
    if (!container) {
        throw new Error("Container element is required")
    }

    if (!zegoAppId) {
        throw new Error('Gegocloud App Id is not configured!')
    }

    // clean up the existing instance if any 

    if (zegoInstance && !isDestroying) {
        try {
            isDestroying = true;

            if (typeof zegoInstance.destroy === 'function') {
                zegoInstance.destroy();
            }

            zegoInstance = null;
            userHasJoined = false;
        } catch (e) {
            console.error(e);
        } finally {
            isDestroying = false;
        }
    }


    let hasPermission = false;
    try {
        hasPermission = await requestMediaPermission();

        if (!hasPermission) {
            console.warn("Media permission not granted upfront, SDK will request them");

        }
    } catch (error) {
        console.warn("Could not pre-request permission, SDK will handle it", error);
    }


    let kitToken;
    try {
        kitToken = generateKitToken(roomId, userId, userName);

        if (!kitToken) {
            throw new Error('Failed to generated kit token')
        }
    } catch (error) {
        console.error("Token generation error", error);
        throw new Error(`Failed to generate zego token: ${error.message}`)

    }


    // Create a zego ui kit instance
    let zp;
    try {
        zp = ZegoUIKitPrebuilt.create(kitToken);
        if (!zp) {
            throw new Error('Failed to create zego UIKit instance')
        }
    } catch (error) {
        console.error("ZEGO instance creation error", error);
        throw new Error('Failed to create ZEGO instace', error.message)
    }

    // small delay 
    await new Promise(resolve => setTimeout(resolve, 100))

    // join room with prebuildui kit 

    try {
        zp.joinRoom({
            container: container,
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall
            },
            turnOnCameraWhenJoining: hasPermission,
            turnOnMicrophoneWhenJoining: hasPermission,
            showMyCameraToggleButton: true,
            showMyMicrophoneToggleButton: true,
            showAudioVideoSettingButton: true,
            showTextChat: true,
            showUserList: true,
            onJoiningRoom: () => {
                userHasJoined = true;
                if (onJoinCallback && typeof onJoinCallback === 'function') {
                    onJoinCallback();
                }
            },
            onLeaveRoom: () => {
                userHasJoined= false;
                if (onLeaveCallback && typeof onLeaveCallback === 'function') {
                    onLeaveCallback();
                }
            },
            onError: (error) => {
                console.error("ZEGO room error", error)
            }
        })
    } catch (error) {
        console.error('Error during joining ZEGO room', error);
        if (zp && typeof zp.destroy === 'function' && !isDestroying) {
            isDestroying = true;
            try {
                zp.destroy()
            } catch (error) {
                console.error('Error destroying ZEGO instance', error);

            } finally {
                isDestroying = false;
            }
        }

        zegoInstance= null;
        userHasJoined= false;
        throw new Error(`Failed to join room: ${error.message}`)
    }

    zegoInstance = zp;
    return zp;
}


export const leaveRoom = (onLeaveCallback) => {
    if (!zegoInstance || isDestroying) {
        if (onLeaveCallback && typeof onLeaveCallback === 'function') {
            onLeaveCallback();
        }

        return;
    }

    isDestroying= true;
    const instance = zegoInstance;
    zegoInstance = null;
    userHasJoined = false;

    if (onLeaveCallback && typeof onLeaveCallback == 'function') {
        try {
            onLeaveCallback();
        } catch (error) {
            console.error("error in leaveRoom callback", error);
        }
    }


    try {
        if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
        } else if (instance && typeof instance.leaveRoom == 'function') {
            instance.leaveRoom();
        }
    } catch (error) {
        console.error('Error leaving zego room', error);
    } finally {
        isDestroying = false;
    }
}


export const getZegoInstace = () => {
    return zegoInstance;
}


export const hasUserJoined = () => {
    return userHasJoined;
}