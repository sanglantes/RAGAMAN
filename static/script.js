document.getElementById("guess-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var guessInput = document.getElementById("guess").value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/check_solution", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (!response.valid) {
                var points = document.getElementById("points");
                var currentPoints = parseInt(points.textContent);
                var earnedPoints = response.solution;
                points.textContent = currentPoints + earnedPoints;

                // Create a new element to display the earned points
                var earnedPointsElement = document.createElement("span");
                earnedPointsElement.className = "earned-points";
                earnedPointsElement.textContent = "+" + earnedPoints;
                points.parentNode.insertBefore(earnedPointsElement, points.nextSibling);

                // Animate the earned points element
                animateEarnedPoints(earnedPointsElement);

                document.getElementById("feedback").style.display = "none";
            } else {
                document.getElementById("feedback").style.display = "block";
                document.getElementById("feedback").textContent = response.solution;
            }
            document.getElementById("guess").value = '';
        }
    };

    var data = JSON.stringify({ "word": guessInput });
    xhr.send(data);
});

document.getElementById("new").addEventListener("click", function(event) {
    event.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/new_word", true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var scrambledWordElement = document.getElementById("scrambled_word");
            scrambledWordElement.innerHTML = response.scrambled_word;
            styleKeys(scrambledWordElement);
            document.getElementById("feedback").style.display = "none";
            document.getElementById("guess").focus();
        }
    };

    xhr.send();
});

function styleKeys(element) {
    var word = element.textContent;
    var keys = '';
    for (var i = 0; i < word.length; i++) {
        keys += '<span class="key">' + word[i] + '</span>';
    }
    element.innerHTML = keys;
}

function animateEarnedPoints(element) {
    var distance = 40; // Distance to move upwards
    var duration = 1000; // 1 second
    var start = performance.now();
    var opacity = 1;

    requestAnimationFrame(function animate(timestamp) {
        var progress = timestamp - start;
        var translateY = distance - (progress / duration) * distance;

        element.style.transform = "translateY(-" + translateY + "px)";
        element.style.opacity = opacity;

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            fadeOut(element);
        }
    });

    function fadeOut(element) {
        var opacity = 1;
        var duration = 500; // 0.5 second
        var start = performance.now();

        requestAnimationFrame(function fade(timestamp) {
            var progress = timestamp - start;
            opacity = 1 - (progress / duration);

            element.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(fade);
            } else {
                element.parentNode.removeChild(element);
            }
        });
    }
}