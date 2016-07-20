import shutil

FILES = [
	['./app/dev/index.min.html', './app/dist/index.min.html'],
	['./app/dev/app.min.js', './app/dist/app.min.js'],
	['./app/dev/bg/background.min.js', './app/dist/bg/background.min.js'],
	['./app/dev/bg/background.min.html', './app/dist/bg/background.min.html'],
]

for file in FILES:
	print("MOVING from " + file[0] + " to " + file[1])
	shutil.copy(file[0], file[1])