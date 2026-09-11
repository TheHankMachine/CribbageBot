import subprocess
import datetime
import time
import os


LOG_DIR = "./logs"
LOGGING_TIME_FORMAT = "%Y %b %d %H %M %S"
TERMINATE_CODE  = 0x48414C54 # HALT in hexidecimal
REBUILD_CODE    = 0x4d414b45 # MAKE in hexicdecimal
GIT_PULL_CODE   = 0x50554c4c # PULL in hexicdecimal
MIN_UPTIME_BEFORE_SHUTOFF = 10


def run_and_log(command):
    now = datetime.now().strftime(LOGGING_TIME_FORMAT)
    log_path = os.path.join(LOG_DIR, f"{now}.txt")

    with open(log_path, "w", buffering=1) as log_file:
        result = subprocess.run(
            command,
            stdout=log_file,
            stderr=subprocess.STDOUT,
            shell=True
        )
        log_file.write(f"\n[process ended with code {result.returncode}]\n")
        return result.returncode


def start():
    return run_command("npm start")


def quick_start():
    return run_command("npm run quickstart")


# This is really dumb
def git_pull_and_start():
    return run_command("git pull && npm start")


def start_and_keep_alive():
    last_down = time.time()
    result = start()

    while True:
        # if we are here then the program ended
        uptime = time.time() - last_down
        if uptime <= MIN_UPTIME_BEFORE_SHUTOFF:
            return

        time.sleep(5)
        last_down = time.time()

        if result == TERMINATE_CODE:
            return
        elif result == REBUILD_CODE:
            result = start()
        elif result == GIT_PULL_CODE:
            result = git_pull_and_start()
        else:
            result = quick_start()



if __name__ == "__main__":
    start_and_keep_alive()