const asyncHandler = require('express-async-handler')
const prisma = require('../utils/prisma')
const {
  teachersAttendanceValidator,
} = require('../validators/attendanceValidator')
const {
  selectQueries,
  attendanceFields,
  paginateWithSorting,
} = require('../utils/metaData')
const dayjs = require('dayjs')
const { formatDate } = require('../utils/transformData')
const generateFileLink = require('../utils/generateFileLink')

/*
  @route    POST: /attendance/teachers
  @access   private
  @desc     Get All teachers for attendance
*/
const getTeachersForAttendance = asyncHandler(async (req, res, next) => {
  const selectedQueries = selectQueries(req.query, attendanceFields)
  const { page, take, skip, orderBy } = paginateWithSorting(selectedQueries)

  let { date } = selectedQueries
  date = new Date(date).toISOString()

  const [teachers, total] = await prisma.$transaction([
    prisma.teachers.findMany({
      take,
      skip,
      orderBy,
      select: {
        id: true,
        name: true,
        profile_img: true,
        designation: true,
        attendance: {
          where: {
            date,
          },
        },
      },
    }),
    prisma.teachers.count(),
  ])

  const formatTeachers = teachers.map(
    ({ id, name, designation, attendance, profile_img }) => ({
      id,
      name,
      profile_img: profile_img
        ? generateFileLink(`teachers/profiles/${profile_img}`)
        : null,
      designation: designation.title,
      attendance: attendance.length
        ? {
            teacher_id: attendance.at(0).teacher_id,
            status: attendance.at(0).status,
            date: formatDate(attendance.at(0).date),
          }
        : null,
    })
  )

  res.json({
    data: formatTeachers,
    meta: {
      page,
      limit: take,
      total,
    },
  })
})

/*
  @route    GET: /attendance/teachers/:id
  @access   private
  @desc     Get a teacher's attendance details 
*/
const getTeacherAttendanceDetails = asyncHandler(async (req, res, next) => {
  const id = Number(req.params.id)

  const findTeacherAttendance = await prisma.teacher_attendance.findMany({
    where: {
      teacher_id: id,
    },
  })

  if (!findTeacherAttendance)
    return res.status(404).json({
      message: 'No teacher found',
    })

  const formatData = findTeacherAttendance.map(({ status, date }) => ({
    title: status,
    start: dayjs(date).format('YYYY, M, D'),
    end: dayjs(date).format('YYYY, M, D'),
  }))

  res.json(formatData)
})

/*
  @route    POST: /attendance/teachers/:id
  @access   private
  @desc     Attendance for a teacher
*/
const createTeacherAttendance = asyncHandler(async (req, res, next) => {
  const data = await teachersAttendanceValidator.validate(req.body, {
    abortEarly: false,
  })

  const id = Number(data.teacher_id)
  data.date = new Date(data.date).toISOString()

  await prisma.$transaction(async (tx) => {
    const existAttendance = await tx.teacher_attendance.findFirst({
      where: {
        AND: [{ teacher_id: id }, { date: data.date }],
      },
    })

    // If attendance already exist for the date then update it
    if (existAttendance) {
      await tx.teacher_attendance.update({
        where: {
          id: existAttendance.id,
        },
        data,
      })

      res.json({
        message: 'Attendance updated',
      })
    } else {
      // Create new attendance (If not exist)
      await tx.teacher_attendance.create({
        data,
      })

      res.json({
        message: 'Done',
      })
    }
  })
})

module.exports = {
  getTeachersForAttendance,
  getTeacherAttendanceDetails,
  createTeacherAttendance,
}
