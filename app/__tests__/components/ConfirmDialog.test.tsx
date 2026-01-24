import React from 'react'
import { render, screen, fireEvent, within, waitFor } from '../test-utils'
import ConfirmDialog from '../../components/ConfirmDialog'

describe('ConfirmDialog', () => {
  const mockOnOk = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when open is false', () => {
    render(
      <ConfirmDialog
        open={false}
        title="Test Dialog"
        content="Test Content"
        onOk={mockOnOk}
        onClose={mockOnClose}
      />
    )

    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument()
  })

  it('should render correct title and content when open is true', async () => {
    /*
      Note: rendering Dialog in tests usually requires handling portals.
      By default @testing-library/react renders into a container appended to document.body,
      and MUI Dialog renders into document.body as well, so queries typically work.
      However, using 'baseElement' in render might be safer if queries fail,
      but screen queries usually look at document.body which covers portals.
    */
    const { baseElement } = render(
      <ConfirmDialog
        open={true}
        title="Test Dialog"
        content="Test Content"
        onOk={mockOnOk}
        onClose={mockOnClose}
      />
    )

    // Use baseElement or screen to query for portal content
    await waitFor(() => {
      expect(within(baseElement).getByText('Test Dialog')).toBeInTheDocument()
      expect(within(baseElement).getByText('Test Content')).toBeInTheDocument()
    })
  })

  it('should call onOk when Confirm button is clicked', async () => {
    const { baseElement } = render(
      <ConfirmDialog
        open={true}
        title="Test Dialog"
        content="Test Content"
        onOk={mockOnOk}
        onClose={mockOnClose}
      />
    )

    await waitFor(() => {
      const confirmButton = within(baseElement).getByText('Confirm')
      fireEvent.click(confirmButton)
    })

    expect(mockOnOk).toHaveBeenCalledTimes(1)
    // onClose is NOT called by default in ConfirmDialog handleOk implementation
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should call onClose when Cancel button is clicked', async () => {
    const { baseElement } = render(
      <ConfirmDialog
        open={true}
        title="Test Dialog"
        content="Test Content"
        onOk={mockOnOk}
        onClose={mockOnClose}
      />
    )

    await waitFor(() => {
      const cancelButton = within(baseElement).getByText('Cancel')
      fireEvent.click(cancelButton)
    })

    expect(mockOnClose).toHaveBeenCalledTimes(1)
    expect(mockOnOk).not.toHaveBeenCalled()
  })
})
