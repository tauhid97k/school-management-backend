const prisma = require('../utils/prisma')
const asyncHandler = require('express-async-handler')
const {
  selectQueries,
  paginateFields,
  paginateWithSorting,
} = require('../utils/transformData')

/*
  @route    GET: /teachers
  @access   private
  @desc     Get all teachers
*/
const getTeachers = asyncHandler(async (req, res, next) => {
  const selectedQueries = selectQueries(req.query, paginateFields)
  const { page, take, skip, orderBy } = paginateWithSorting(selectedQueries)

  const [teachers, total] = await prisma.$transaction([
    prisma.teachers.findMany({
      take,
      skip,
      orderBy,
    }),
    prisma.teachers.count(),
  ])

  res.json({
    data: teachers,
    meta: {
      page,
      limit: take,
      total,
    },
  })
})

module.exports = { getTeachers }
