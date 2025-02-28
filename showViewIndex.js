function showView(viewId) {
    // hide all views
    document.getElementById('indexView').style.display = 'none';
    document.getElementById('enterUsernameView').style.display = 'none';
    document.getElementById('waitingRoomView').style.display = 'none';


    // show the selected view
    document.getElementById(viewId).style.display = 'block';
}