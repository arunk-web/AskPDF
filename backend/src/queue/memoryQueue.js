const queue = [];

const addJob = (jobData) => {
    queue.push(jobData);
};

const getNextJob = () => {
    return queue.shift();
};

module.exports = { addJob, getNextJob };