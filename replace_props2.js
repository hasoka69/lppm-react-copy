const fs = require('fs');
const path = require('path');

const dir1 = 'c:/laragon/www/lppm-react/resources/js/pages/dosen/penelitian/steps';
const dir2 = 'c:/laragon/www/lppm-react/resources/js/pages/dosen/pengabdian/steps';

const dirs = [dir1, dir2];

for (const dir of dirs) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
    for (const file of files) {
        const fullPath = path.join(dir, file);
        let content = fs.readFileSync(fullPath, 'utf8');

        content = content.split('<ReviewFeedbackPanel reviewers={usulan?.reviewers as any} />').join('<ReviewFeedbackPanel reviewers={usulan?.reviewers as any} danaAwal={usulan?.dana_usulan_awal} danaDisetujui={usulan?.dana_disetujui} />');
        content = content.split('<ReviewFeedbackPanel reviewers={props.usulan?.reviewers as any} />').join('<ReviewFeedbackPanel reviewers={props.usulan?.reviewers as any} danaAwal={props.usulan?.dana_usulan_awal} danaDisetujui={props.usulan?.dana_disetujui} />');

        fs.writeFileSync(fullPath, content);
    }
}
console.log('done splitting');
