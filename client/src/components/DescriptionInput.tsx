import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '..'

interface DescriptionInputProps {
    file: File
}

export const DescriptionInput: React.FC<DescriptionInputProps> = observer(({ file }) => {
    const [description, setDescription] = useState<string>("")
    const { faces } = useContext(Context)

    useEffect(() => {
        const foundFile = faces.findFaceByFileSizeAndName(file.size, file.name)
        console.log(foundFile?.file.size)
        if (!foundFile) {
            return
        }
        setDescription(foundFile.description)
    }, [file])


    const handleChange = (value: string) => {
        console.log(file.size)
        const foundFile = faces.findFaceByFileSizeAndName(file.size, file.name)
        console.log(foundFile?.file.size)
        if (!foundFile) {
            return
        }
        foundFile.description = value
        setDescription(foundFile.description)
    }


    return (
        <input type="text" style={{ position: 'absolute', bottom: 0 }} value={description} onChange={(event) => handleChange(event.target.value)} className="w-100" />
    );
})
