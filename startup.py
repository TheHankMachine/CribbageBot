import subprocess
import datetime
import os


LOG_DIR = "./logs"
LOGGING_TIME_FORMAT = "%Y %b %d %H %M %S"
HALT_CODE = 0x48414C54 # HALT in hexidecimal


def start():
    return subprocess.run("npm start", capture_output=True, text=True, shell=True)


def quick_start():
    return subprocess.run("npm run quickstart", capture_output=True, text=True, shell=True)


def log_output(subprocess_result):
    now = datetime.datetime.now().strftime(LOGGING_TIME_FORMAT)
    logPath = os.path.join(LOG_DIR, f"{now}.txt")
    with open(logPath, "w") as f:
        f.write(subprocess_result.stdout)
        f.write(subprocess_result.stderr)
        f.write(f"process ended with code {subprocess_result.returncode}")


def start_and_keep_alive():
    result = start()
    while True:
        # if we are here then the program ended
        log_output(result)
        if result.returncode == HALT_CODE:
            return
        result = quick_start();


if __name__ == "__main__":
    start_and_keep_alive()

