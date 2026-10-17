
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>
#include <semaphore.h>
#include <fcntl.h>

#define SHM_NAME "/shared_memory_hackathon"
#define SEM_NAME "/shared_memory_lock"
#define BUFFER_SIZE 256

typedef struct {
    char message[BUFFER_SIZE];
    int version;
    int writer_pid;
} SharedData;

int main(void) {
    setbuf(stdout, NULL);

    int fd = shm_open(SHM_NAME, O_CREAT | O_RDWR, 0666);
    if (fd == -1) {
        perror("shm_open");
        return EXIT_FAILURE;
    }

    if (ftruncate(fd, sizeof(SharedData)) == -1) {
        perror("ftruncate");
        close(fd);
        shm_unlink(SHM_NAME);
        return EXIT_FAILURE;
    }

    SharedData *shared = mmap(NULL, sizeof(SharedData),
        PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

    close(fd);

    if (shared == MAP_FAILED) {
        perror("mmap");
        shm_unlink(SHM_NAME);
        return EXIT_FAILURE;
    }

    memset(shared, 0, sizeof(SharedData));

    sem_unlink(SEM_NAME);
    sem_t *lock = sem_open(SEM_NAME, O_CREAT | O_EXCL, 0600, 1);

    if (lock == SEM_FAILED) {
        perror("sem_open");
        munmap(shared, sizeof(SharedData));
        shm_unlink(SHM_NAME);
        return EXIT_FAILURE;
    }

    printf("=== Shared Memory Data Exchange ===\n");
    printf("Parent PID: %d\n", getpid());
    printf("Shared memory initialized.\n\n");

    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");
        sem_close(lock);
        sem_unlink(SEM_NAME);
        munmap(shared, sizeof(SharedData));
        shm_unlink(SHM_NAME);
        return EXIT_FAILURE;
    }

    if (pid == 0) {
        sem_wait(lock);

        snprintf(shared->message, BUFFER_SIZE,
                 "Hello from Child Process");
        shared->version++;
        shared->writer_pid = getpid();

        printf("[Child %d] Wrote: %s\n",
               getpid(), shared->message);

        sem_post(lock);
        _exit(EXIT_SUCCESS);
    } else {
        waitpid(pid, NULL, 0);

        sem_wait(lock);

        printf("[Parent %d] Read: %s\n",
               getpid(), shared->message);
        printf("Message version: %d\n", shared->version);
        printf("Last writer PID: %d\n", shared->writer_pid);
        printf("\nData exchange successful!\n");

        sem_post(lock);
    }

    sem_close(lock);
    sem_unlink(SEM_NAME);
    munmap(shared, sizeof(SharedData));
    shm_unlink(SHM_NAME);

    return EXIT_SUCCESS;
}
