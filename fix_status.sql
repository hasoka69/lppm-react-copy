ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM('draft', 'submitted', 'approved_prodi', 'rejected_prodi', 'reviewer_review', 'needs_revision', 'didanai', 'ditolak') DEFAULT 'draft';
