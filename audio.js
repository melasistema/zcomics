(function() {

    let audioIsPlaying = false;

    document.addEventListener('DOMContentLoaded', function() {
        let player = document.querySelector('audio');

        // play/pause
        document.querySelector('.audio-player').addEventListener('click', function() {
            if (player.paused) {
                player.play();
                audioIsPlaying = true;
                checkPlayerStatus();

                document.querySelector('.audio-player-button').src = "images/svg/pause-icon.svg";
            } else {
                player.pause();
                audioIsPlaying = false;

                document.querySelector('.audio-player-button').src = "images/svg/play-icon.svg";
            }
        });

        // restarts the whole audio from the beginning
        /*document.querySelector('.audio-player-text').addEventListener('click', function() {
            if (player.paused) {
                document.querySelectorAll('.audio-player-progress-segment').forEach(function(segment) {
                    segment.style.display = "none";
                });

                player.currentTime = 0.0;
                player.play();
                audioIsPlaying = true;
                checkPlayerStatus();

                document.querySelector('.audio-player-button').src = "images/svg/Pause-Icon.svg";
            }
        });*/

        // resets the player, if the audio is over
        player.ontimeupdate = function () {
            const progress = player.currentTime/player.duration;

            if (progress == 1.0) {
                audioIsPlaying = false;
                updateProgressUI();

                document.querySelector('.audio-player-button').src = "images/svg/play-icon.svg";

                document.querySelectorAll('.audio-player-progress-segment').forEach(function(segment) {
                    segment.style.display = "none";
                });
            }
        }
    });

    // Checks, if player is playing and updates the UI accordingly, if so
    function checkPlayerStatus() {
        if (audioIsPlaying) {
            let player = document.querySelector('audio');
            let progress = player.currentTime/player.duration;
            updateProgressUI(progress);

            setTimeout(function () {
                checkPlayerStatus();
            }, 33);
        }
    }

    // updates the progress bar
    function updateProgressUI(progress) {
        let segments = document.querySelectorAll('.audio-player-progress-segment');
        let segmentProgress;

        if (progress < 0.25) {
            segments[0].style.display = "block";

            segmentProgress = -(90-progress*360.0);
            segments[0].style.transform = "skew(0deg,"+segmentProgress+"deg)";
        } else if (progress < 0.5) {
            segments[0].style.transform = "skew(0deg, 0deg)";

            segmentProgress = (180-progress*360.0);
            segments[1].style.transform = "skew("+segmentProgress+"deg, 0deg)";
            segments[1].style.display = "block";
        } else if (progress < 0.75) {
            segments[1].style.transform = "skew(0deg, 0deg)";

            segmentProgress = -(270-progress*360.0);
            segments[2].style.transform = "skew(0deg,"+segmentProgress+"deg)";
            segments[2].style.display = "block";
        } else {
            segments[2].style.transform = "skew(0deg, 0deg)";

            segmentProgress = (360-progress*360.0);
            segments[3].style.transform = "skew("+segmentProgress+"deg, 0deg)";
            segments[3].style.display = "block";
        }
    }

})();
