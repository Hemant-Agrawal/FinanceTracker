import { cn } from '@/lib/utils';
import { EmailRecord, EmailAttachment } from '@/models/EmailRecord';
import { File, ImageIcon, FileText, FileIcon as FilePdf, Paperclip, Eye, Download } from 'lucide-react';
import { ScrollArea } from '@/ui/scroll-area';
import { Button } from '@/ui/button';

interface EmailViewerProps {
  email: EmailRecord;
  className?: string;
}

export default function EmailViewer({ email, className }: EmailViewerProps) {
  const hasAttachments = email.attachments && email.attachments.length > 0

  const handlePreview = (attachment: EmailAttachment) => {
    // setSelectedAttachment(attachment)
    // setPreviewOpen(true)
  }

  const handleDownload = (attachment: EmailAttachment) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a")
    // link.href = attachment.data
    link.download = attachment.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getAttachmentIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    } else if (contentType === "application/pdf") {
      return <FilePdf className="h-4 w-4" />
    } else if (
      contentType === "application/msword" ||
      contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      contentType === "text/plain"
    ) {
      return <FileText className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }
  
  return (
    <div className={cn('relative', className)}>
      <ScrollArea className="border rounded-md h-[80vh]">
        <div className="p-4 border-b overflow-x-auto">
          <div className="font-medium text-wrap">Subject: {email.subject}</div>
          <div className="font-medium text-sm">From: {email.from}</div>
          <div className="font-medium text-sm">To: {email.to.toLowerCase()}</div>
          <div className="text-xs text-muted-foreground">Date: {new Date(email.date).toLocaleString()}</div>
        </div>
        {hasAttachments && (
              <div className="mb-4 p-3 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {email.attachments.length} Attachment{email.attachments.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {email.attachments.map((attachment) => (
                    <div
                      key={attachment.toString()}
                      className="flex items-center justify-between p-2 bg-background rounded border"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {getAttachmentIcon(attachment.mimeType)}
                        <div className="truncate">
                          <div className="truncate text-sm font-medium">{attachment.filename}</div>
                          <div className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handlePreview(attachment)} title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(attachment)} title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        <div className="email-content bg-white text-black" dangerouslySetInnerHTML={{ __html: email.body }} />
      </ScrollArea>
    </div>
  );
}
