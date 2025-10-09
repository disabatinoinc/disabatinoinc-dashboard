'use client';

import { useMemo } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DOMPurify from 'dompurify';

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    html?: string | null;
};

export default function ProposalNotesDrawer({ open, onClose, title = 'Proposal Notes', html }: Props) {
    const safeHtml = useMemo(() => (html ? DOMPurify.sanitize(html) : ''), [html]);

    const copyText = async () => {
        if (!safeHtml) return;
        const tmp = document.createElement('div');
        tmp.innerHTML = safeHtml;
        const text = (tmp.textContent || tmp.innerText || '').trim();
        await navigator.clipboard.writeText(text);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 520 },
                    backgroundColor: '#0b1220',
                    color: 'white',
                    borderLeft: '1px solid #374151',
                },
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: 'white' }}>{title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Copy notes as text" arrow>
                        <IconButton onClick={copyText} size="small" sx={{ color: '#9ca3af' }}>
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Close" arrow>
                        <IconButton onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Divider sx={{ borderColor: '#374151' }} />

            {/* Content */}
            <Box
                sx={{
                    p: 2,
                    '& ul, & ol': { pl: 3, mb: 1.5 },
                    '& p': { mb: 1.25 },
                    '& strong': { fontWeight: 600 },
                    '& em': { fontStyle: 'italic' },
                }}
            >
                {safeHtml ? (
                    <Box dangerouslySetInnerHTML={{ __html: safeHtml }} />
                ) : (
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        No proposal notes available.
                    </Typography>
                )}
            </Box>
        </Drawer>
    );
}
