const yup = require('yup')
const prisma = require('../utils/prisma')

const teacherAssignmentValidator = () =>
  yup.object({
    class_id: yup
      .number()
      .typeError('Class id must be number')
      .required('Class is required')
      .test('exists', 'Class does not exist', async (value) => {
        const findClass = await prisma.classes.findUnique({
          where: {
            id: value,
          },
        })

        if (findClass) return true
        else return false
      }),
    section_id: yup
      .number()
      .typeError('Section id must be number')
      .optional()
      .test('exists', 'Section does not exist', async (value) => {
        if (!value) return true

        const findSection = await prisma.sections.findUnique({
          where: {
            id: value,
          },
        })

        if (findSection) return true
        else return false
      }),
    subject_id: yup
      .number()
      .typeError('Subject id must be number')
      .required('Subject is required')
      .test('exists', 'Subject does not exist', async (value) => {
        const findSubject = await prisma.subjects.findUnique({
          where: {
            id: value,
          },
        })

        if (findSubject) return true
        else return false
      }),
    title: yup.string().required('Title is required'),
    description: yup.string().optional(),
    attachment: yup.string().optional(),
    assignment_time: yup
      .date()
      .required('Assignment time is required')
      .test('time', 'Assignment time must be in the future', (value) => {
        const currentDate = new Date()
        const startDate = new Date(value)
        return startDate > currentDate
      }),
    submission_time: yup
      .date()
      .required('Submission time is required')
      .test('time', 'Assignment time must be in the future', (value) => {
        const currentDate = new Date()
        const startDate = new Date(value)
        return startDate > currentDate
      }),
    status: yup
      .string()
      .required('Status is required')
      .oneOf(['ACTIVE', 'DRAFT', 'CANCELLED', 'CONCLUDED']),
  })

const assignmentAttachmentValidator = () =>
  yup.object({
    attachment: yup
      .mixed()
      .test(
        'type',
        'Invalid file type. Only image or pdf is allowed',
        (file) => {
          const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/pdf',
          ]
          return allowedTypes.includes(file.mimetype)
        }
      )
      .test('size', 'File size is too large; max 10mb is allowed', (file) => {
        const maxSize = 10 * 1024 * 1024
        return file.size <= maxSize
      }),
  })

module.exports = { teacherAssignmentValidator, assignmentAttachmentValidator }
