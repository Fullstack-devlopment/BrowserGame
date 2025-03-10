function showView(viewId) {
    // hide all views
    document.getElementById('writeAnswer').style.display = 'none';
    document.getElementById('voteAnswer').style.display = 'none';
    document.getElementById('bestAnswer').style.display = 'none';
    document.getElementById('resultView').style.display = 'none';


    // show the selected view
    document.getElementById(viewId).style.display = 'block';
}