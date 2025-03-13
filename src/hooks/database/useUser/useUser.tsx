import { useRxData } from "rxdb-hooks"
import { UserDocType } from "../../../Shared/types/user.types"

const useUser = () => {
  const {result: currentUser, isFetching } = useRxData<UserDocType>('user', (collection) => (
    collection.find()
  ))
  return {
    currentUser: currentUser[0],
    isFetching
  }
}

export default useUser