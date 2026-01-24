import Ajv from 'ajv'
import { ReportItem } from 'types/state'
import schema from './reportSchema'

const validateReport = (items: ReportItem[]) => {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  const errors: string[] = []
  items.forEach((item: ReportItem) => {
    const valid = validate(item)
    if (!valid && validate.errors) {
      validate.errors.forEach((error) => {
        errors.push(
          `[${(item as ReportItem).room}] '${error.instancePath.replace(
            '/',
            ''
          )}' ${error.message}.`
        )
      })
    }
  })
  return errors
}

export default validateReport
