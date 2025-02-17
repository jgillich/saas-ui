import * as React from 'react'
import { Story, Meta } from '@storybook/react'

import { Container, Stack, Button } from '@chakra-ui/react'

import { DataTable, DataTableProps, TableInstance, ColumnDef } from '../src'

import { randUser } from '@ngneat/falso'

import { getPaginationRowModel } from '@tanstack/react-table'

export default {
  title: 'Components/Data Display/DataTable',
  component: DataTable,
  decorators: [
    (Story: any) => (
      <Container mt="40px" maxW="container.xl">
        <Story />
      </Container>
    ),
  ],
} as Meta

const Template: Story<DataTableProps<ExampleData>> = ({
  data,
  columns,
  initialState,
  ...args
}) => (
  <DataTable<ExampleData>
    data={data}
    columns={columns}
    initialState={initialState}
    {...args}
  />
)

interface ExampleData {
  id: string
  username: string
  firstName: string
  lastName: string
  phone: string
  email: string
}

const columns: ColumnDef<ExampleData>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'firstName',
    header: 'First name',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
]

const data = randUser({ length: 20 })

const initialState = {
  columnVisibility: { phone: false },
}

export const Default = Template.bind({})
Default.args = {
  columns,
  data,
  initialState,
}

export const Sortable = Template.bind({})
Sortable.args = {
  columns,
  data,
  initialState,
  isSortable: true,
}

export const Selectable = Template.bind({})
Selectable.args = {
  columns,
  data,
  initialState,
  isSelectable: true,
}

export const InitialSelected = Template.bind({})
InitialSelected.args = {
  columns,
  data,
  initialState: {
    ...initialState,
    rowSelection: { 1: true },
  },
  isSelectable: true,
}

export const SelectedChange = Template.bind({})
SelectedChange.args = {
  columns,
  data,
  initialState,
  isSelectable: true,
  onSelectedRowsChange: (rows) => console.log(rows),
}

export const SelectableAndSortable = Template.bind({})
SelectableAndSortable.args = {
  columns,
  data,
  initialState,
  isSortable: true,
  isSelectable: true,
}

export const Numeric = Template.bind({})
Numeric.args = {
  columns,
  data,
  initialState,
}

const withLinks = (columns.concat() as any).map((column: any) => {
  if (column.accessorKey === 'username') {
    return Object.assign({}, column, {
      meta: {
        href: (row: any) => {
          return `/customers/${row.id}`
        },
        ...column.meta,
      },
    })
  }
  return column
})

export const WithLink = Template.bind({})
WithLink.args = {
  columns: withLinks,
  data,
  initialState,
}

export const TableInstanceRef = () => {
  const ref = React.useRef<TableInstance<ExampleData>>(null)

  return (
    <>
      <Stack direction="row" mb="8">
        <Button onClick={() => ref.current?.toggleAllRowsSelected()}>
          Toggle select all
        </Button>
      </Stack>
      <DataTable<ExampleData>
        ref={ref}
        columns={columns}
        data={data}
        isSelectable
        isSortable
      />
    </>
  )
}
