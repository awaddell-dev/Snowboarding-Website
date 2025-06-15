
function ContactFormManager(formId, feedbackId) {
  this.form = document.getElementById(formId);
  this.feedback = document.getElementById(feedbackId);
  this.selectedReasons = [];

  if (!this.form || !this.feedback) {
    console.warn('ContactFormManager: form or feedback element not found.');
    return;
  }

  var self = this;

  this.form.addEventListener('change', function(e) {
    if (e.target && e.target.name === 'reasonOptions') {
      self.handleReasonChange(e.target);
    }
  });

  this.form.addEventListener('submit', function(e) {
    e.preventDefault();
    self.handleSubmit();
  });
}

ContactFormManager.prototype.handleReasonChange = function(checkbox) {
  var val = checkbox.value;
  if (checkbox.checked) {
    if (this.selectedReasons.indexOf(val) === -1) {
      this.selectedReasons.push(val);
    }
  } else {
    var idx = this.selectedReasons.indexOf(val);
    if (idx > -1) {
      this.selectedReasons.splice(idx, 1);
    }
  }
};

ContactFormManager.prototype.reasonsToString = function() {
  return this.selectedReasons.join(', ');
};

ContactFormManager.prototype.validateEmail = function(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

ContactFormManager.prototype.handleSubmit = function() {
  this.feedback.textContent = '';
  this.feedback.style.color = 'red';

  var name = this.form.querySelector('#name').value.trim();
  var email = this.form.querySelector('#email').value.trim();
  var message = this.form.querySelector('#message').value.trim();

  if (!name || !email || this.selectedReasons.length === 0 || !message) {
    this.feedback.textContent = 'Please fill out all required fields and select at least one reason.';
    return;
  }

  if (!this.validateEmail(email)) {
    this.feedback.textContent = 'Please enter a valid email address.';
    return;
  }

  this.feedback.textContent = 'Thanks for your message! Reasons: ' + this.reasonsToString() + '. Stay stoked!';
  this.feedback.style.color = '#00ffd0';
  this.form.reset();
  this.selectedReasons = [];
};

document.addEventListener('DOMContentLoaded', () => {
  new ContactFormManager('contactForm', 'formFeedback');
});
