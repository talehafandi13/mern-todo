const Task = require('../model/task')

exports.getAllTasks = async (_, res) => {
    try {
        let tasks = await Task.aggregate([ {$match:{ isDeleted: false}} ])
        // console.log(tasks);

        res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

exports.getArchived = async (_, res) => {
    try {
        let archived = await Task.aggregate([ {$match:{ isDeleted: true}} ])
        // console.log(tasks);

        res.status(200).json({
            success: true,
            archived
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

exports.getPendings = async (req, res) => {
    try {
        let status = req.params.status
        // console.log(status);
        let tasks = await Task.aggregate([ {$match:{ isDeleted: false, status}} ])
        // console.log(tasks);
        res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

exports.addTask = async (req, res) => {
    try {
        let task = await Task.create(req.body)
        let tasks = await Task.aggregate([ {$match:{ isDeleted: false}} ])
        res.status(200).json({
            success: true,
            task,
            tasks
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

exports.archiveTask = async (req, res) => {
    try {
        const options = req.body
        console.log(options);
        const id = req.params.id
        const task = await Task.findById(id)
        if(!task) return res.status(404).json({success: false, message: "Task is not found"})

        task.isDeleted = true
        await task.save()
        
        const tasks = await Task.aggregate([ {$match:{ isDeleted: false}} ])

        res.status(200).json({
            success: true,
            task,
            tasks
        })
    } catch (error) {
        console.log(error.message);
        res.status(200).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateTask = async(req, res) => {
    try {
        const data = req.body.data
        const id = req.params.id
        const options = req.body.options 

        if(!options) return res.status(404).json({success: false, message: "Filter is missing"})


        let task = await Task.findById(id)
        if(!task) return res.status(404).json({success: false, message: "Task is not found"})
        
        task.name = data.name
        task.status = data.status
        await task.save()

        // console.log("options: ", options);
        let tasks = await Task.aggregate([ {$match: options  } ])

        res.status(200).json({
            success: true,
            task,
            tasks
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }

}

exports.deleteAll = async (_, res) => {

    let ans = await Task.updateMany({}, {isDeleted: true})
    // console.log(ans);
    let tasks = await Task.aggregate([ {$match:{ isDeleted: false}} ])
    
    res.status(200).json({
        success: true,
        tasks
    })
}
