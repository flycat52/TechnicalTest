function fileChange() {
    init();

    var min = document.getElementById('min');
    var max = document.getElementById('max');

    var file = document.getElementById('fileInput').files[0]; //single file


    if (checkFileType(file)) { //check file type
        var reader = new FileReader();

        reader.onload = function(e) {
            var content = reader.result;
            var lines = content.split('\n');

            var diff = [];

            for (var i = 2; i < lines.length; i++) { //start with the 3rd line
                var line = lines[i].trim().replace(/\s+/g, ' ').split(' '); //replace tabs to single space

                var mxt = parseFloat(removeSpecialCharacters(line[1])); //line[1]: MxT
                var mnt = parseFloat(removeSpecialCharacters(line[2])); //line[2]: Mnt


                diff.push({ Dy: line[0], Diff: Math.abs(mxt - mnt) }); //line[0]: Dy
            }

            diff.sort(sortArray); // in ascending order
            min.innerText = diff[0].Dy;
            max.innerText = diff[diff.length - 1].Dy;

            console.log(diff[0].Dy + " " + diff[0].Diff);
            console.log(diff[diff.length - 1].Dy + " " + diff[diff.length - 1].Diff);

        }

        reader.readAsText(file);
    }
}

function init() {
    document.getElementById('min').innerText = '';
    document.getElementById('max').innerText = '';
}

// function isNumber(obj) {
//     return obj !== undefined && typeof(obj) === 'number' && !isNaN(obj);
// }

function removeSpecialCharacters(obj) {
    return obj.replace(/[^0-9. ]/g, "")
}

function sortArray(a, b) {
    if (a.Diff > b.Diff) return 1;
    else return -1;
}

function checkFileType(file) {
    var extension = file.name.substr((file.name.lastIndexOf('.') + 1));
    if (!/(dat)$/ig.test(extension)) {
        alert("File not supported!");
        return;
    }
    return true;
}