import { CompetitionType } from "@prisma/client"
import React from "react"
import FormMahasiswa from "./FormMahasiswa"
import FormSiswa from "./FormSiswa"

type Props = {
  type: CompetitionType
}

const FormCompetition: React.FC<Props> = ({ type }) => {

  return (
    <div>
      {type === "LKTI" ? <FormMahasiswa type="LKTI" /> : <FormSiswa type={type} />}
    </div>
  )
}

export default FormCompetition