class Web::BoardsController < Web::ApplicationController
  before_action :authenticate_user!

  def show
    # puts render.inspect
    puts "CHECKING!!!!!!!!!!"
    render react_component: 'TaskBoard', props: {}
  end
end
