import Toast from 'react-native-root-toast';

export default function Show(msg, delay) {
    let toast = Toast.show(msg);
    delay = delay || (delay = 2000);

    setTimeout(function() {
        Toast.hide(toast);
    }, delay); 

}