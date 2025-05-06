import { Validation } from 'isomorphic-validation';
import { applyAccess, applyOutline, applyBox, renderFirstError, renderProperty } from 'isomorphic-validation/ui';

const delayedOutline = {
  false: { delay: 2000, value: '2px solid lightpink' },
  true: { delay: 500, value: '' },
};

const delayedAccess = {
  true: { delay: 600 },
};

const disabledAccess = {
  false: { value: true },
  true: { value: true },
};

const remainedOutline = {
  false: { delay: 20000, value: '' },
  true: { delay: 20000, value: '' },
};

const changedOutline = {
  false: { delay: 500, value: '2px solid lightpink' },
  true: { delay: 500, value: '' },
};

const editIcon = {
  false: { value: '🖊' },
  true: { value: '🖊' },
  position: 'LEVEL_RIGHT',
};

const loadImg = `
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDUwIDUwIj4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjBBNUZBIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWRhc2hhcnJheT0iNjAgMTIwIj4KICAgIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBmcm9tPSIwIDI1IDI1IiB0bz0iMzYwIDI1IDI1IiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDwvY2lyY2xlPgo8L3N2Zz4=" alt="SVG Image" />
`;

const loadIcon = {
  false: { delay: 1000, value: loadImg },
  true: { delay: 1000, value: loadImg },
  position: 'LEVEL_RIGHT',
};

const validIcon = {
  false: { delay: 1000, value: '' },
  true: { delay: 500, value: '✔' },
  position: 'LEVEL_RIGHT_BESIDE',
  style: { color: 'green', left: '-8px' },
};

const errMsg = {
  false: { delay: 2000, value: renderFirstError('err') },
  position: 'BELOW_CENTER',
  mode: 'MAX_SIDE',
  style: { color: 'firebrick', fontSize: '12px', padding: '4px' },
};

const changedMsg = {
  false: { delay: 500, value: renderFirstError('err') },
  position: 'BELOW_CENTER',
  mode: 'MAX_SIDE',
  style: { color: 'firebrick', fontSize: '12px', padding: '4px' },
};

const waitMsg = {
  false: { delay: 1000, value: renderProperty('waitMsg') },
  true: { delay: 1000, value: renderProperty('waitMsg') },
  position: 'BELOW_CENTER',
  mode: 'MAX_SIDE',
  style: { color: 'steelblue', fontSize: '12px', padding: '4px' },
};

const applyEffects = (validationProfile) => {
  const [form, groupingValidation] = validationProfile;

  form.addEventListener(
    'input',
    Validation.group(

      groupingValidation.validations.map(
        (validation, idx) => {

          const iconEID = form[idx].name + 'icon';
          const errMsgEID = form[idx].name + 'error';
          const outlineEID = form[idx].name + 'outline';
          const formField = form[idx].parentNode;

          return validation
            .started(applyOutline(formField, remainedOutline, outlineEID))
            .validated(applyOutline(formField, delayedOutline, outlineEID))
            .changed(applyOutline(formField, changedOutline, outlineEID))
            .started(applyBox(formField, editIcon, iconEID))
            .started(applyBox(formField, loadIcon, iconEID))
            .validated(applyBox(formField, validIcon, iconEID))
            .changed(applyBox(formField, validIcon, iconEID))
            .started(applyBox(formField, waitMsg, errMsgEID))
            .validated(applyBox(formField, errMsg, errMsgEID))
            .changed(applyBox(formField, changedMsg, errMsgEID));
        }
      )
    )
    .started(applyAccess(form.submitBtn, disabledAccess))
    .validated(applyAccess(form.submitBtn, delayedAccess))
  );
};

export default applyEffects;