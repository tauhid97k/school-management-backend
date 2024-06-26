// Select only given keys from query string
const selectQueries = (obj, keys) => {
  const finalObj = {}
  // Map and set only defined keys
  keys.forEach((key) => {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key]
    }
  })

  return finalObj
}

// Pagination and sorting functionalities
const paginateWithSorting = (options) => {
  const page = Number(options.page <= 0 ? 1 : options.page || 1)
  const take = Number(options.limit || 15)
  const skip = (page - 1) * take
  const sortBy = options.sortBy || "id"
  const sortOrder = options.sortOrder || "desc"

  return {
    page,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
  }
}

// Pagination and sorting keys (Common)
const commonFields = ["search", "page", "limit", "sortBy", "sortOrder"]

const studentsFields = [
  "class_id",
  "roll",
  "gender",
  "search",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

const subjectFields = [
  "class_id",
  "search",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

// Attendance Fields
const attendanceFields = ["date", "page", "limit", "sortBy", "sortOrder"]

// Noticeboard Fields
const noticeFields = ["type", "page", "limit", "sortBy", "sortOrder"]

// Teacher Noticeboard Fields
const teacherNoticeFields = ["status", "page", "limit", "sortBy", "sortOrder"]

// Exam Field
const examFields = [
  "class_id",
  "section_id",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

// Exam Result Fields
const examResultFields = [
  "class_id",
  "section_id",
  "exam_id",
  "student_roll",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

// Teacher Assignments Fields
const assignmentFields = [
  "class_id",
  "section_id",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

// Class Routine Fields
const classRoutineFields = [
  "week_day",
  "class_id",
  "section_id",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

// Application Fields
const applicationFields = [
  "date",
  "class_id",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

// Teacher Salary Fields
const salaryFields = [
  "teacher_id",
  "status",
  "issued_at",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

// Student fees Fields
const studentFeesFields = [
  "class_id",
  "section_id",
  "student_id",
  "payment_status",
  "payment_date",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]

module.exports = {
  selectQueries,
  paginateWithSorting,
  commonFields,
  attendanceFields,
  noticeFields,
  teacherNoticeFields,
  studentsFields,
  examFields,
  examResultFields,
  assignmentFields,
  classRoutineFields,
  applicationFields,
  salaryFields,
  studentFeesFields,
  subjectFields,
}
