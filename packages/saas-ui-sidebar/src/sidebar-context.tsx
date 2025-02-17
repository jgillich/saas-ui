import { createContext } from '@chakra-ui/react-utils'
import { SystemStyleObject } from '@chakra-ui/react'

export const [SidebarStylesProvider, useSidebarStyles] = createContext<
  Record<string, SystemStyleObject>
>({
  name: `SidebarStylesContext`,
  // hookName: `useSidebarItemStyles`,
  // providerName: '<SidebarItem />',
})
